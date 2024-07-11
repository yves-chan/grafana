// SPDX-License-Identifier: AGPL-3.0-only

// Code generated by client-gen. DO NOT EDIT.

package fake

import (
	"context"
	json "encoding/json"
	"fmt"

	v0alpha1 "github.com/grafana/grafana/pkg/apis/alerting_notifications/v0alpha1"
	alertingnotificationsv0alpha1 "github.com/grafana/grafana/pkg/generated/applyconfiguration/alerting_notifications/v0alpha1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	labels "k8s.io/apimachinery/pkg/labels"
	types "k8s.io/apimachinery/pkg/types"
	watch "k8s.io/apimachinery/pkg/watch"
	testing "k8s.io/client-go/testing"
)

// FakeReceivers implements ReceiverInterface
type FakeReceivers struct {
	Fake *FakeNotificationsV0alpha1
	ns   string
}

var receiversResource = v0alpha1.SchemeGroupVersion.WithResource("receivers")

var receiversKind = v0alpha1.SchemeGroupVersion.WithKind("Receiver")

// Get takes name of the receiver, and returns the corresponding receiver object, and an error if there is any.
func (c *FakeReceivers) Get(ctx context.Context, name string, options v1.GetOptions) (result *v0alpha1.Receiver, err error) {
	obj, err := c.Fake.
		Invokes(testing.NewGetAction(receiversResource, c.ns, name), &v0alpha1.Receiver{})

	if obj == nil {
		return nil, err
	}
	return obj.(*v0alpha1.Receiver), err
}

// List takes label and field selectors, and returns the list of Receivers that match those selectors.
func (c *FakeReceivers) List(ctx context.Context, opts v1.ListOptions) (result *v0alpha1.ReceiverList, err error) {
	obj, err := c.Fake.
		Invokes(testing.NewListAction(receiversResource, receiversKind, c.ns, opts), &v0alpha1.ReceiverList{})

	if obj == nil {
		return nil, err
	}

	label, _, _ := testing.ExtractFromListOptions(opts)
	if label == nil {
		label = labels.Everything()
	}
	list := &v0alpha1.ReceiverList{ListMeta: obj.(*v0alpha1.ReceiverList).ListMeta}
	for _, item := range obj.(*v0alpha1.ReceiverList).Items {
		if label.Matches(labels.Set(item.Labels)) {
			list.Items = append(list.Items, item)
		}
	}
	return list, err
}

// Watch returns a watch.Interface that watches the requested receivers.
func (c *FakeReceivers) Watch(ctx context.Context, opts v1.ListOptions) (watch.Interface, error) {
	return c.Fake.
		InvokesWatch(testing.NewWatchAction(receiversResource, c.ns, opts))

}

// Create takes the representation of a receiver and creates it.  Returns the server's representation of the receiver, and an error, if there is any.
func (c *FakeReceivers) Create(ctx context.Context, receiver *v0alpha1.Receiver, opts v1.CreateOptions) (result *v0alpha1.Receiver, err error) {
	obj, err := c.Fake.
		Invokes(testing.NewCreateAction(receiversResource, c.ns, receiver), &v0alpha1.Receiver{})

	if obj == nil {
		return nil, err
	}
	return obj.(*v0alpha1.Receiver), err
}

// Update takes the representation of a receiver and updates it. Returns the server's representation of the receiver, and an error, if there is any.
func (c *FakeReceivers) Update(ctx context.Context, receiver *v0alpha1.Receiver, opts v1.UpdateOptions) (result *v0alpha1.Receiver, err error) {
	obj, err := c.Fake.
		Invokes(testing.NewUpdateAction(receiversResource, c.ns, receiver), &v0alpha1.Receiver{})

	if obj == nil {
		return nil, err
	}
	return obj.(*v0alpha1.Receiver), err
}

// Delete takes name of the receiver and deletes it. Returns an error if one occurs.
func (c *FakeReceivers) Delete(ctx context.Context, name string, opts v1.DeleteOptions) error {
	_, err := c.Fake.
		Invokes(testing.NewDeleteActionWithOptions(receiversResource, c.ns, name, opts), &v0alpha1.Receiver{})

	return err
}

// DeleteCollection deletes a collection of objects.
func (c *FakeReceivers) DeleteCollection(ctx context.Context, opts v1.DeleteOptions, listOpts v1.ListOptions) error {
	action := testing.NewDeleteCollectionAction(receiversResource, c.ns, listOpts)

	_, err := c.Fake.Invokes(action, &v0alpha1.ReceiverList{})
	return err
}

// Patch applies the patch and returns the patched receiver.
func (c *FakeReceivers) Patch(ctx context.Context, name string, pt types.PatchType, data []byte, opts v1.PatchOptions, subresources ...string) (result *v0alpha1.Receiver, err error) {
	obj, err := c.Fake.
		Invokes(testing.NewPatchSubresourceAction(receiversResource, c.ns, name, pt, data, subresources...), &v0alpha1.Receiver{})

	if obj == nil {
		return nil, err
	}
	return obj.(*v0alpha1.Receiver), err
}

// Apply takes the given apply declarative configuration, applies it and returns the applied receiver.
func (c *FakeReceivers) Apply(ctx context.Context, receiver *alertingnotificationsv0alpha1.ReceiverApplyConfiguration, opts v1.ApplyOptions) (result *v0alpha1.Receiver, err error) {
	if receiver == nil {
		return nil, fmt.Errorf("receiver provided to Apply must not be nil")
	}
	data, err := json.Marshal(receiver)
	if err != nil {
		return nil, err
	}
	name := receiver.Name
	if name == nil {
		return nil, fmt.Errorf("receiver.Name must be provided to Apply")
	}
	obj, err := c.Fake.
		Invokes(testing.NewPatchSubresourceAction(receiversResource, c.ns, *name, types.ApplyPatchType, data), &v0alpha1.Receiver{})

	if obj == nil {
		return nil, err
	}
	return obj.(*v0alpha1.Receiver), err
}
